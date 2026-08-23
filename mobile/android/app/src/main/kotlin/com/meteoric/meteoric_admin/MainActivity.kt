package com.meteoric.meteoric_admin

import android.content.Intent
import android.net.Uri
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import androidx.core.content.FileProvider
import java.io.File

class MainActivity : FlutterActivity() {
    private val updaterChannel = "meteoric/updater"
    private val shareChannel = "meteoric/share"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            updaterChannel
        ).setMethodCallHandler { call, result ->
            when (call.method) {
                "installApk" -> {
                    try {
                        val path = call.arguments as String
                        val file = File(path)
                        if (!file.exists()) {
                            result.error("FILE_NOT_FOUND", "APK not found at $path", null)
                            return@setMethodCallHandler
                        }
                        val uri = FileProvider.getUriForFile(
                            this,
                            "$packageName.fileprovider",
                            file
                        )
                        val intent = Intent(Intent.ACTION_VIEW)
                            .setDataAndType(uri, "application/vnd.android.package-archive")
                            .addFlags(
                                Intent.FLAG_GRANT_READ_URI_PERMISSION or
                                    Intent.FLAG_ACTIVITY_NEW_TASK
                            )
                        startActivity(intent)
                        result.success(true)
                    } catch (e: Exception) {
                        result.error("INSTALL_ERROR", e.message, null)
                    }
                }
                else -> result.notImplemented()
            }
        }

        MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            shareChannel
        ).setMethodCallHandler { call, result ->
            when (call.method) {
                "shareFile" -> {
                    try {
                        val args = call.arguments as Map<*, *>
                        val name = args["name"] as String
                        val mime = args["mime"] as String
                        val content = args["content"] as String
                        val dir = File(cacheDir, "exports").apply {
                            if (!exists()) mkdirs()
                        }
                        val file = File(dir, name)
                        file.writeText(content)
                        val uri = FileProvider.getUriForFile(
                            this,
                            "$packageName.fileprovider",
                            file
                        )
                        val intent = Intent(Intent.ACTION_SEND)
                            .setType(mime)
                            .putExtra(Intent.EXTRA_STREAM, uri)
                            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        startActivity(
                            Intent.createChooser(intent, "Share").addFlags(
                                Intent.FLAG_ACTIVITY_NEW_TASK
                            )
                        )
                        result.success(true)
                    } catch (e: Exception) {
                        result.error("SHARE_ERROR", e.message, null)
                    }
                }
                "shareFileB64" -> {
                    try {
                        val args = call.arguments as Map<*, *>
                        val name = args["name"] as String
                        val mime = args["mime"] as String
                        val b64 = args["b64"] as String
                        val bytes = android.util.Base64.decode(b64, android.util.Base64.DEFAULT)
                        val dir = File(cacheDir, "exports").apply {
                            if (!exists()) mkdirs()
                        }
                        val file = File(dir, name)
                        file.writeBytes(bytes)
                        val uri = FileProvider.getUriForFile(
                            this,
                            "$packageName.fileprovider",
                            file
                        )
                        val intent = Intent(Intent.ACTION_SEND)
                            .setType(mime)
                            .putExtra(Intent.EXTRA_STREAM, uri)
                            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        startActivity(
                            Intent.createChooser(intent, "Share").addFlags(
                                Intent.FLAG_ACTIVITY_NEW_TASK
                            )
                        )
                        result.success(true)
                    } catch (e: Exception) {
                        result.error("SHARE_ERROR", e.message, null)
                    }
                }
                "openUrl" -> {
                    try {
                        val url = call.arguments as String
                        startActivity(
                            Intent(Intent.ACTION_VIEW, Uri.parse(url)).addFlags(
                                Intent.FLAG_ACTIVITY_NEW_TASK
                            )
                        )
                        result.success(true)
                    } catch (e: Exception) {
                        result.error("OPEN_ERROR", e.message, null)
                    }
                }
                else -> result.notImplemented()
            }
        }
    }
}
