/*
package com.example.preranasingh.smsgateway;

import android.app.Application;
import android.content.IntentFilter;
import android.provider.Telephony;
import android.util.Log;

*/
/**
 * Created by Aliandro on 10/13/2018.
 *//*

public class App extends Application {

    private SmsBroadcastReceiver smsBroadcastReceiver;

    @Override
    public void onCreate() {
        super.onCreate();
        smsBroadcastReceiver = new SmsBroadcastReceiver();
        registerReceiver(smsBroadcastReceiver, new IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION));
        Log.d("test", "onCreate: REgistered the receiver");

    }

    @Override
    public void onTerminate() {
        unregisterReceiver(smsBroadcastReceiver);
        super.onTerminate();
    }
}*/
