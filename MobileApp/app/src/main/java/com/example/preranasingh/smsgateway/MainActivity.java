package com.example.preranasingh.smsgateway;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    TextView username,password;
    Button btnLogin;
    String email,pass;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        username=findViewById(R.id.editUsername);
        password=findViewById(R.id.editPassword);
        btnLogin=findViewById(R.id.btnLogin);
        btnLogin.setOnClickListener(this);

    }

    @Override
    public void onClick(View view) {
        if (view.getId()==R.id.btnLogin){
            email=username.getText().toString();
            pass=password.getText().toString();
        }
    }
}
