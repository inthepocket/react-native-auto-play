//
//  NowPlayingTemplate.swift
//  react-native-autoplay
//
//  Created by Claude Code
//

import CarPlay

class NowPlayingTemplate: NSObject, AutoPlayTemplate, CPNowPlayingTemplateObserver {
    let template: CPNowPlayingTemplate
    var config: NowPlayingTemplateConfig

    var autoDismissMs: Double? {
        return config.autoDismissMs
    }

    func getTemplate() -> CPTemplate {
        return template
    }

    init(config: NowPlayingTemplateConfig) {
        self.config = config
        self.template = CPNowPlayingTemplate.shared
        super.init()

        // Set up observers for upNext and albumArtist buttons
        template.add(self)

        // Configure initial state
        Task { @MainActor in
            self.invalidate()
        }
    }

    deinit {
        template.remove(self)
    }

    @MainActor
    func invalidate() {
        // Update album artist button
        template.isAlbumArtistButtonEnabled = config.albumArtistButtonEnabled ?? false

        // Update up next button
        template.isUpNextButtonEnabled = config.upNextButtonEnabled ?? false
        if let title = config.upNextButtonTitle {
            template.upNextTitle = title
        }

        // Update now playing buttons
        updateNowPlayingButtons(buttons: config.buttons)
    }

    @MainActor
    private func updateNowPlayingButtons(buttons: [NitroNowPlayingButton]?) {
        guard let buttons = buttons else {
            template.updateNowPlayingButtons([])
            return
        }

        var cpButtons: [CPNowPlayingButton] = []

        for button in buttons {
            let cpButton = createCPButton(from: button)
            if let cpButton = cpButton {
                cpButtons.append(cpButton)
            }
        }

        template.updateNowPlayingButtons(cpButtons)
    }

    @MainActor
    private func createCPButton(from button: NitroNowPlayingButton) -> CPNowPlayingButton? {
        let handler: (CPNowPlayingButton) -> Void = { [weak self] _ in
            button.onPress(button.isSelected ?? false)
        }

        switch button.type {
        case .shuffle:
            let shuffleButton = CPNowPlayingShuffleButton(handler: handler)
            if let isSelected = button.isSelected {
                shuffleButton.isSelected = isSelected
            }
            return shuffleButton

        case .addtolibrary:
            let addButton = CPNowPlayingAddToLibraryButton(handler: handler)
            if let isSelected = button.isSelected {
                addButton.isSelected = isSelected
            }
            return addButton

        case .more:
            return CPNowPlayingMoreButton(handler: handler)

        case .playbackrate:
            return CPNowPlayingPlaybackRateButton(handler: handler)

        case .repeat:
            let repeatButton = CPNowPlayingRepeatButton(handler: handler)
            if let isSelected = button.isSelected {
                repeatButton.isSelected = isSelected
            }
            return repeatButton

        case .image:
            guard let imageData = button.image else {
                return nil
            }
            guard let image = Parser.parseNitroImage(
                image: imageData,
                traitCollection: SceneStore.getRootTraitCollection()
            ) else {
                return nil
            }
            return CPNowPlayingImageButton(image: image, handler: handler)
        }
    }

    func onWillAppear(animated: Bool) {
        config.onWillAppear?(animated)
    }

    func onDidAppear(animated: Bool) {
        config.onDidAppear?(animated)
    }

    func onWillDisappear(animated: Bool) {
        config.onWillDisappear?(animated)
    }

    func onDidDisappear(animated: Bool) {
        config.onDidDisappear?(animated)
    }

    func onPopped() {
        // Clean up observers
        template.remove(self)
        config.onPopped?()
    }

    func traitCollectionDidChange() {
        // NowPlaying template doesn't need trait collection updates
    }

    @MainActor
    func updateButtons(buttons: [NitroNowPlayingButton]) {
        config.buttons = buttons
        updateNowPlayingButtons(buttons: buttons)
    }

    @MainActor
    func setAlbumArtistButtonEnabled(enabled: Bool) {
        config.albumArtistButtonEnabled = enabled
        template.isAlbumArtistButtonEnabled = enabled
    }

    @MainActor
    func setUpNextButtonEnabled(enabled: Bool, title: String?) {
        config.upNextButtonEnabled = enabled
        template.isUpNextButtonEnabled = enabled
        if let title = title {
            config.upNextButtonTitle = title
            template.upNextTitle = title
        }
    }

    // MARK: - CPNowPlayingTemplateObserver

    func nowPlayingTemplateUpNextButtonTapped(_ nowPlayingTemplate: CPNowPlayingTemplate) {
        config.onUpNextButtonPressed?()
    }

    func nowPlayingTemplateAlbumArtistButtonTapped(_ nowPlayingTemplate: CPNowPlayingTemplate) {
        config.onAlbumArtistButtonPressed?()
    }
}
