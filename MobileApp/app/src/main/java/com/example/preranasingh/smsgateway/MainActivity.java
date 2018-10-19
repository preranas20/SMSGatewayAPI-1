package com.example.preranasingh.smsgateway;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.gson.Gson;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private static final String TAG ="smsTest" ;
   // private static String remoteIP="http://18.234.89.40:5000";
    private String remoteIP="http://18.223.110.166:5000"; //ankit ec2

    TextView username,password,phone;
    Button btnLogin;
    String email,pass,phonenumber;
    private static final int SMS_PERMISSION_CODE = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        username=findViewById(R.id.editUsername);
        password=findViewById(R.id.editPassword);
        phone= findViewById(R.id.editPhone);
        btnLogin=findViewById(R.id.btnLogin);
        btnLogin.setOnClickListener(this);

        SharedPreferences sharedPref = getSharedPreferences(
                "mypref", Context.MODE_PRIVATE);
       String phonen = sharedPref.getString("ThisPhoneNumber",null);
        Log.d(TAG, "onCreate: phonen "+phonen );
    if (    phonen!=null && !phonen.isEmpty()){
       username.setVisibility(View.INVISIBLE);
       password.setVisibility(View.INVISIBLE);
       phone.setVisibility(View.INVISIBLE);
       btnLogin.setVisibility(View.INVISIBLE);
       TextView tex= findViewById(R.id.textView);
       tex.setText("SMS gateway is running!");
       blink();
     }


        if ( !isSmsPermissionGranted())
            requestReadAndSendSmsPermission();

    }
    public void blink(){
        ImageView image  = (ImageView) findViewById(R.id.logo);
        image.setVisibility(View.VISIBLE);
        Animation animation = new AlphaAnimation((float) 0.5, 0); // Change alpha from fully visible to invisible
        animation.setDuration(500); // duration - half a second
        animation.setInterpolator(new LinearInterpolator()); // do not alter
        // animation
        // rate
        animation.setRepeatCount(Animation.INFINITE); // Repeat animation
        // infinitely
        animation.setRepeatMode(Animation.REVERSE); // Reverse animation at the
        // end so the button will
        // fade back in
        image.startAnimation(animation);
    }
    public void loginApi(String username, String password, final String PhoneNumber)
    {

        final OkHttpClient client = new OkHttpClient();
        RequestBody formBody = new FormBody.Builder()
                .add("email", username)
                .add("password", password)
                .build();
        Request request = new Request.Builder()
                .url(remoteIP+"/user/login")
                .header("Content-Type","application/json")
                .post(formBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: login ");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String str;
                try (final ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {

                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                Toast.makeText(MainActivity.this, responseBody.toString(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }



                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    //System.out.println(responseBody.string());
                    str=responseBody.string();
                }
                // str= response.body().string();
                Log.d(TAG, "onResponse: "+str );
                Gson gson = new Gson();

                final ResponseApi result=  (ResponseApi) gson.fromJson(str, ResponseApi.class); // Fails to deserialize foo.value as Bar
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (!result.status.equalsIgnoreCase("200")) {
                            Toast.makeText(MainActivity.this, result.message, Toast.LENGTH_SHORT).show();
                        }else {
                          EditText username=findViewById(R.id.editUsername);
                      EditText      password=findViewById(R.id.editPassword);
                            EditText    phone= findViewById(R.id.editPhone);
                            username.setVisibility(View.INVISIBLE);
                            password.setVisibility(View.INVISIBLE);
                            phone.setVisibility(View.INVISIBLE);
                            Button btnLogin = findViewById(R.id.btnLogin);
                            btnLogin.setVisibility(View.INVISIBLE);
                            TextView tex= findViewById(R.id.textView);
                            tex.setText("SMS gateway is running!");
                            blink();
                            saveDeviceMapping(PhoneNumber,result.token);

                        }
                        //   Toast.makeText(activity, "token created successfully", Toast.LENGTH_SHORT).show();
                        //do something more.

                    }
                });
            }

        });

    }

    public boolean isSmsPermissionGranted() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this, Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED;
    }


    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        switch (requestCode) {
            case SMS_PERMISSION_CODE: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    // permission was granted, yay! Do the
                    // SMS related task you need to do.

                } else {
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                }
                return;
            }
            // other 'case' lines to check for other
            // permissions this app might request
        }
    }
    /**
     * Request runtime SMS permission
     */
    private void requestReadAndSendSmsPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.READ_SMS)) {
            // You may display a non-blocking explanation here, read more in the documentation:
            // https://developer.android.com/training/permissions/requesting.html
        }
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_SMS,Manifest.permission.SEND_SMS, Manifest.permission.RECEIVE_SMS}, SMS_PERMISSION_CODE);
    }
    @Override
    public void onClick(View view) {
        if (view.getId()==R.id.btnLogin){
            email=username.getText().toString();
            pass=password.getText().toString();

            phonenumber = "+1"+phone.getText().toString();
            if(email.isEmpty())
            {
                username.setError("Field cannot be empty");
            }
            else if(pass.isEmpty()){
                password.setError("Field cannot be empty");
            }
            else if(phonenumber.equals("+1")){
                phone.setError("Field cannot be empty");
            }
            else{
                loginApi(email, pass, phonenumber);
                //SmsManager.getDefault().sendTextMessage("9804309833", null, "sending sms through the dev app", null, null);
            }


        }
    }
    public static void sendDebugSms(String number, String smsBody) {
        SmsManager smsManager = SmsManager.getDefault();
        smsManager.sendTextMessage(number, null, smsBody, null, null);
        Log.d(TAG, "sendDebugSms: sending sms");;
    }

    public void saveDeviceMapping(final String PhoneNumber, final String token) {

        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "getInstanceId failed", task.getException());
                            return;
                        }

                        // Get new Instance ID token
                        String deviceId = task.getResult().getToken();
                        //save in pref. as well
                        SharedPreferences sharedPref =  MainActivity.this.getSharedPreferences(
                                "mypref", Context.MODE_PRIVATE);
                        SharedPreferences.Editor editor = sharedPref.edit();
                        //saving user full name and user Id that might require on threads or messages activity
                        Log.d("tesetdelete", "saveToken: "+  PhoneNumber);
                        editor.putString("ThisPhoneNumber", PhoneNumber);
                           editor.putString("deviceId",deviceId);//result.getUser_fname());
                        //    editor.putString("userId",result.getUser_id());
                        editor.apply();
                        // Log and toast
                        //deviceId= getString(R.string.msg_token_fmt, deviceId);
                        Log.d(TAG, deviceId);
                        Toast.makeText(MainActivity.this, deviceId, Toast.LENGTH_SHORT).show();

                        final OkHttpClient client = new OkHttpClient();
                        RequestBody formBody = new FormBody.Builder()
                                .add("deviceId", deviceId)
                                .add("phone", PhoneNumber)
                                .build();
                        Request request = new Request.Builder()
                                .url(remoteIP+"/user/addDevice")
                                .post(formBody)
                                .addHeader("Authorization","BEARER "+token)
                                .build();
                        client.newCall(request).enqueue(new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                                Log.d(TAG, "onFailure: ");
                            }

                            @Override
                            public void onResponse(Call call, final Response response) throws IOException {
                                String str;
                                try (final ResponseBody responseBody = response.body()) {

                                    Headers responseHeaders = response.headers();
                                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                                       // System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                                    }
                                    str=responseBody.string();
                                }

                                Log.d(TAG, "onResponse: "+str );
                                Gson gson = new Gson();

                                final ResponseApi result=  (ResponseApi) gson.fromJson(str, ResponseApi.class); // Fails to deserialize foo.value as Bar
                                Log.d(TAG, "smsTest: "+ result.message);
                            }

                        });

                    }
                });

    }
}
