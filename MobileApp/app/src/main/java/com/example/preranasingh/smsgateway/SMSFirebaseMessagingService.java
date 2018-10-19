package com.example.preranasingh.smsgateway;

import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.google.gson.Gson;

import java.util.Map;

/**
 * Created by Aliandro on 10/16/2018.
 */

public class SMSFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG ="fcmTest" ;

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "Refreshed token: " + token);

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // Instance ID token to your app server.
        sendRegistrationToServer(token);
    }

    private void sendRegistrationToServer(String token) {
        //todo call the server api to save this token with the device number
        //have to send user's phone number along with this token.
    }
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // ...

        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());



             Map result=  remoteMessage.getData(); // Fails to deserialize foo.value as Bar
String number = result.get("title").toString();
String body =  result.get("body").toString();
            MainActivity.sendDebugSms(number, body);



        }else  if (remoteMessage.getNotification() != null) {
                Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
                String number = remoteMessage.getNotification().getTitle();

                MainActivity.sendDebugSms(number, remoteMessage.getNotification().getBody());
            }
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.


}
