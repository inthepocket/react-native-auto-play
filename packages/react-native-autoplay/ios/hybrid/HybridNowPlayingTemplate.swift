//
//  HybridNowPlayingTemplate.swift
//  react-native-autoplay
//
//  Created by Claude Code
//

import NitroModules

class HybridNowPlayingTemplate: HybridNowPlayingTemplateSpec {
    func configureNowPlayingTemplate(config: NowPlayingTemplateConfig) throws {
        let template = NowPlayingTemplate(config: config)
        TemplateStore.addTemplate(
            template: template,
            templateId: config.id
        )
    }

    func updateNowPlayingButtons(
        templateId: String,
        buttons: [NitroNowPlayingButton]
    ) throws -> Promise<Void> {
        return Promise.async {
            guard
                let template = TemplateStore.getTemplate(templateId: templateId)
                    as? NowPlayingTemplate
            else {
                throw AutoPlayError.invalidTemplateType(
                    "\(templateId) is not a NowPlayingTemplate"
                )
            }

            await template.updateButtons(buttons: buttons)
        }
    }

    func setAlbumArtistButtonEnabled(
        templateId: String,
        enabled: Bool
    ) throws -> Promise<Void> {
        return Promise.async {
            guard
                let template = TemplateStore.getTemplate(templateId: templateId)
                    as? NowPlayingTemplate
            else {
                throw AutoPlayError.invalidTemplateType(
                    "\(templateId) is not a NowPlayingTemplate"
                )
            }

            await template.setAlbumArtistButtonEnabled(enabled: enabled)
        }
    }

    func setUpNextButtonEnabled(
        templateId: String,
        enabled: Bool,
        title: String?
    ) throws -> Promise<Void> {
        return Promise.async {
            guard
                let template = TemplateStore.getTemplate(templateId: templateId)
                    as? NowPlayingTemplate
            else {
                throw AutoPlayError.invalidTemplateType(
                    "\(templateId) is not a NowPlayingTemplate"
                )
            }

            await template.setUpNextButtonEnabled(enabled: enabled, title: title)
        }
    }
}
