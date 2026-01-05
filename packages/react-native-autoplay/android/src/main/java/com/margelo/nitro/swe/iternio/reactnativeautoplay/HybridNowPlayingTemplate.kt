package com.margelo.nitro.swe.iternio.reactnativeautoplay

import com.margelo.nitro.core.Promise
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.AndroidAutoTemplate
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.NowPlayingTemplate

class HybridNowPlayingTemplate : HybridNowPlayingTemplateSpec() {

    override fun configureNowPlayingTemplate(config: NowPlayingTemplateConfig) {
        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("configureNowPlayingTemplate failed, carContext not found")

        val template = NowPlayingTemplate(context, config)
        AndroidAutoTemplate.setTemplate(config.id, template)
    }

    override fun updateNowPlayingButtons(
        templateId: String,
        buttons: Array<NitroNowPlayingButton>
    ): Promise<Unit> {
        return Promise.async {
            val template = AndroidAutoTemplate.getTemplate<NowPlayingTemplate>(templateId)
            template.updateButtons(buttons)
        }
    }

    override fun setAlbumArtistButtonEnabled(
        templateId: String,
        enabled: Boolean
    ): Promise<Unit> {
        return Promise.async {
            val template = AndroidAutoTemplate.getTemplate<NowPlayingTemplate>(templateId)
            template.setAlbumArtistButtonEnabled(enabled)
        }
    }

    override fun setUpNextButtonEnabled(
        templateId: String,
        enabled: Boolean,
        title: String?
    ): Promise<Unit> {
        return Promise.async {
            val template = AndroidAutoTemplate.getTemplate<NowPlayingTemplate>(templateId)
            template.setUpNextButtonEnabled(enabled, title)
        }
    }
}
