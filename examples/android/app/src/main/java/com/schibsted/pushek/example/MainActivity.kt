package com.schibsted.pushek.example

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.iid.FirebaseInstanceId
import kotlinx.android.synthetic.main.activity_main.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONObject
import java.io.IOException

class MainActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "ExampleApp"
        private const val FIREBASE_URL = "YOUR_FIREBASE_FUNCTION_URL"
    }

    private lateinit var broadcaster: LocalBroadcastManager

    private val pushReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            Log.d(TAG, "Message received in activity. Yay!")
            var result = "Message received with:\n"
            intent?.extras?.keySet()?.forEach {
                result += "$it : ${intent.extras?.getString(it)}"
            }
            message.text = result
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        broadcaster = LocalBroadcastManager.getInstance(this)
        broadcaster.registerReceiver(pushReceiver, IntentFilter(MyFcmService.ACTION_SEND_PUSH_MSG))

        FirebaseInstanceId.getInstance().instanceId
            .addOnCompleteListener(OnCompleteListener { task ->
                if (!task.isSuccessful) {
                    Log.w(TAG, "getInstanceId failed", task.exception)
                    return@OnCompleteListener
                }

                // Get new Instance ID token
                val token = task.result?.token

                if (token == null) {
                    Log.w(TAG, "There is no token")
                    return@OnCompleteListener
                }

                // Log and toast
                Log.d(TAG, token)

                registerButton.setOnClickListener {
                    registerDevice(pinEntryField.text.toString(), token)
                }
            })
    }

    override fun onDestroy() {
        broadcaster.unregisterReceiver(pushReceiver)
        super.onDestroy()
    }

    private fun registerDevice(pin: String, token: String) {

        val json = JSONObject()
            .put("token", token)
            .put("systemName", "Android")
            .put("systemVersion", Build.VERSION.RELEASE)
            .put("pusherType", "fcm")
            .toString(2)

        val requestBody = json.toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("$FIREBASE_URL/pins/$pin")
            .post(requestBody)
            .build()
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY })
            .build()
            .newCall(request)
            .enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    Log.e(TAG, "Failed to register device!", e)
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        runOnUiThread {
                            Toast.makeText(this@MainActivity, "Device registered successfully", Toast.LENGTH_SHORT)
                                .show()
                        }
                    } else {
                        Log.e(TAG, "WTF? ${response.code}, ${response.message}")
                    }
                }

            })
    }
}
