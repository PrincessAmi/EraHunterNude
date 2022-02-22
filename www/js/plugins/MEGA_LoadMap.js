(function () {
	var megaEL_default_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
	Window_TitleCommand.prototype.makeCommandList = function () {
		megaEL_default_makeCommandList.call(this);
		this.goToMap();
	}

	Window_TitleCommand.prototype.goToMap = function () {
		this.addCommand('Extra', 'goToMap');
	}

	var megaEL_default_createCommandWindow1 = Scene_Title.prototype.createCommandWindow;
	Scene_Title.prototype.createCommandWindow = function () {
		megaEL_default_createCommandWindow1.call(this);
		this._commandWindow.setHandler('goToMap', this.commandLoadExtraMap.bind(this));
	}
	Scene_Title.prototype.commandLoadExtraMap = function () {
		// SceneManager.push(Scene_Picture_Gallery);
		Scene_Boot.prototype.demoload()
	}

	Scene_Boot.prototype.demoload = function () {
		var tempId = $dataSystem.startMapId
		$dataSystem.startMapId = 200

		Scene_Base.prototype.start.call(this);
		if (DataManager.isBattleTest()) {
			DataManager.setupBattleTest();
			SceneManager.goto(Scene_Battle);
		} else {
			this.checkPlayerLocation();
			DataManager.setupNewGame();
			SceneManager.goto(Scene_Map);
		}

		this.updateDocumentTitle();

		$dataSystem.startMapId = tempId
	}
})()
