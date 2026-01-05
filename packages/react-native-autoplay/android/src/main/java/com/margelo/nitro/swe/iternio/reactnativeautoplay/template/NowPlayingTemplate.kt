package com.margelo.nitro.swe.iternio.reactnativeautoplay.template

import android.util.Log
import androidx.car.app.CarContext
import androidx.car.app.model.CarText
import androidx.car.app.model.MessageTemplate
import androidx.car.app.model.Template
import com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroAction
import com.margelo.nitro.swe.iternio.reactnativeautoplay.NowPlayingTemplateConfig

class NowPlayingTemplate(context: CarContext, config: NowPlayingTemplateConfig) :
    AndroidAutoTemplate<NowPlayingTemplateConfig>(context, config) {

    override val isRenderTemplate = false
    override val templateId: String
        get() = config.id
    override val autoDismissMs = config.autoDismissMs

    override fun parse(): Template {
        Log.i(TAG, "NowPlaying template displayed - Media controls are managed by MediaSession")

        val message = CarText.create(
            "Media playback controls are available in the Android Auto media interface. " +
            "Use the media button on your car's display or the Android Auto app to control playback."
        )

        val template = MessageTemplate.Builder(message).apply {
            setTitle("Now Playing")
            config.headerActions?.let { actions ->
                if (actions.isNotEmpty()) {
                    setHeader(Parser.parseHeader(context, "Now Playing", config.headerActions))
                }
            }
        }.build()

        return template
    }

    override fun onDidAppear() {
        config.onDidAppear?.let { it(null) }
    }

    override fun onDidDisappear() {
        config.onDidDisappear?.let { it(null) }
    }

    override fun onPopped() {
        config.onPopped?.let { it() }
        templates.remove(templateId)
    }

    override fun onWillAppear() {
        config.onWillAppear?.let { it(null) }
    }

    override fun onWillDisappear() {
        config.onWillDisappear?.let { it(null) }
    }

    override fun setTemplateHeaderActions(headerActions: Array<NitroAction>?) {
        config = config.copy(headerActions = headerActions)
        super.applyConfigUpdate()
    }

    fun updateButtons(buttons: Array<com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroNowPlayingButton>) {
        Log.i(TAG, "updateButtons called - Android Auto uses MediaSession for media controls")
        // No-op: Android Auto uses MediaSession provided by react-native-track-player
    }

    fun setAlbumArtistButtonEnabled(enabled: Boolean) {
        Log.i(TAG, "setAlbumArtistButtonEnabled called - Android Auto uses MediaSession for media controls")
        // No-op: Android Auto uses MediaSession provided by react-native-track-player
    }

    fun setUpNextButtonEnabled(enabled: Boolean, title: String?) {
        Log.i(TAG, "setUpNextButtonEnabled called - Android Auto uses MediaSession for media controls")
        // No-op: Android Auto uses MediaSession provided by react-native-track-player
    }

    companion object {
        const val TAG = "NowPlayingTemplate"
    }
}
