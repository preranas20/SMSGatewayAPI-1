package com.example.preranasingh.smsgateway;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.Toast;

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

/**
 * Created by Aliandro on 10/13/2018.
 */

public class SmsBroadcastReceiver extends BroadcastReceiver {

    private static final String TAG = "SmsBroadcastReceiver";

    private Listener listener;
   // private String remoteIP="http://18.234.89.40:5000";
    private String remoteIP="http://18.223.110.166:5000";

    public SmsBroadcastReceiver() {

    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)) {
            String smsSender = "";
            String smsBody = "";
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                for (SmsMessage smsMessage : Telephony.Sms.Intents.getMessagesFromIntent(intent)) {
                    smsSender = smsMessage.getDisplayOriginatingAddress();
                    smsBody += smsMessage.getMessageBody();
                }
            } else {
                Bundle smsBundle = intent.getExtras();
                if (smsBundle != null) {
                    Object[] pdus = (Object[]) smsBundle.get("pdus");
                    if (pdus == null) {
                        // Display some error to the user
                        Log.e(TAG, "SmsBundle had no pdus key");
                        return;
                    }
                    SmsMessage[] messages = new SmsMessage[pdus.length];
                    for (int i = 0; i < messages.length; i++) {
                        messages[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                        smsBody += messages[i].getMessageBody();
                    }
                    smsSender = messages[0].getOriginatingAddress();
                }
            }
            Toast.makeText(context, "BroadcastReceiver caught SMS: " + smsBody, Toast.LENGTH_LONG).show();
            Log.d(TAG, "SMS detected: From " + smsSender + " With text " + smsBody);
            sendMessageToserver(smsSender,smsBody,context);
         //   if (smsSender.equals(serviceProviderNumber) && smsBody.startsWith(serviceProviderSmsCondition)) {
                if (listener != null) {
                    listener.onTextReceived(smsBody);
                }
         //   }
        }
    }
    public void sendMessageToserver(String fromNumber, String messageText, final Context context) {
        String deviceId;

        SharedPreferences sharedPref = context.getSharedPreferences(
                "mypref", Context.MODE_PRIVATE);
        deviceId = sharedPref.getString("deviceId",null);
        final OkHttpClient client = new OkHttpClient();
        RequestBody formBody = new FormBody.Builder()
                .add("message",messageText)
                .add("deviceId",deviceId)
                .add("from",fromNumber)
                .build();
        Request request = new Request.Builder()
                .url(remoteIP+"/user/recivedToGateway")
                .post(formBody)
                .header("Content-Type","application/json")
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
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
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
    void setListener(Listener listener) {
        this.listener = listener;
    }

    interface Listener {
        void onTextReceived(String text);
    }
}