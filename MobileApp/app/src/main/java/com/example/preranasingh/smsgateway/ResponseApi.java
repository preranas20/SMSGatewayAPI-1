package com.example.preranasingh.smsgateway;

import java.io.Serializable;

/**
 * Created by Aliandro on 4/2/2018.
 */

public class ResponseApi implements Serializable {
    // any
  public  String status,callback_webhook,textmessage,from,to;
    public String token;

    public String message;
    public String data;
}
