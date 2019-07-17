package com.schibsted.pushek.example

import android.content.Intent
import android.util.Log
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFcmService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "ExampleApp"
        const val ACTION_SEND_PUSH_MSG = "com.schibsted.pushek.example.SEND_PUSH_MSG"
    }

    lateinit var broadcaster: LocalBroadcastManager

    override fun onCreate() {
        super.onCreate()
        broadcaster = LocalBroadcastManager.getInstance(this)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage?) {
        Log.d(TAG, "Messaged received $remoteMessage")
        val intent = Intent(ACTION_SEND_PUSH_MSG)
        remoteMessage?.data?.forEach {
            intent.putExtra(it.key, it.value)
        }

        remoteMessage?.notification?.let {
            intent.putExtra("title", it.title)
            intent.putExtra("body", it.body)
        }

        broadcaster.sendBroadcast(intent)
    }

    override fun onNewToken(newToken: String?) {
        Log.d(TAG, "New token $newToken")
    }
}