(function () {
    l10nStrings = {
        identity : 'игры',
        aborting : 'Идет отмена',
        cancel   : 'Отменить',
        close    : 'Закрыть',
        ok       : 'ОК',

        errorTitle              : 'Ошибка',
        errorNonexistentPassage : 'Параграф "{passage}" не существует',
        errorSaveMissingData    : 'в сохранении нет необходимых данных. Сохранение было повреждено или загружен неверный файл',
        errorSaveIdMismatch     : 'сохранение от другой {identity}',

        _warningIntroLacking  : 'Приносим извинения! В вашем браузере отсутствуют либо выключены необходимые функции',
        _warningOutroDegraded : ', так что включен ограниченный режим. Вы можете продолжать, но кое-что может работать некорректно.',
        warningNoWebStorage   : '{_warningIntroLacking} (Web Storage API) {_warningOutroDegraded}',
        warningDegraded       : '{_warningIntroLacking} (требуемые этой игрой) {_warningOutroDegraded}',

        debugViewTitle  : 'Режим отладки',
        debugViewToggle : 'Переключить режим отладки',

        uiBarToggle   : 'Открыть/закрыть панель навигации',
        uiBarBackward : 'Назад по истории {identity}',
        uiBarForward  : 'Вперед по истории {identity}',
        uiBarJumpto   : 'Перейти в определенную точку истории {identity}',

        jumptoTitle       : 'Перейти на',
        jumptoTurn        : 'Ход',
        jumptoUnavailable : 'В данный момент нет точек для перехода\u2026',

        savesTitle       : 'Сохранения',
        savesDisallowed  : 'На этом параграфе сохранение запрещено.',
        savesEmptySlot   : '— пустой слот —',
        savesIncapable   : '{_warningIntroLacking}, так что сохранения невозможны в текущей сессии',
        savesLabelAuto   : 'Автосохранение',
        savesLabelDelete : 'Автосохранение',
        savesLabelExport : 'Сохранить на диск\u2026',
        savesLabelImport : 'Загрузить с диска\u2026',
        savesLabelLoad   : 'Загрузить',
        savesLabelClear  : 'Удалить все',
        savesLabelSave   : 'Сохранить',
        savesLabelSlot   : 'Слот',
        savesSavedOn     : 'Сохранено: ',
        savesUnavailable : 'Слоты сохранения не обнаружены\u2026',
        savesUnknownDate : 'неизвестно',

        settingsTitle : 'Настройки',
        settingsOff   : 'Выкл.',
        settingsOn    : 'Вкл.',
        settingsReset : 'По умолчанию',

        restartTitle  : 'Начать с начала',
        restartPrompt : 'Вы уверены, что хотите начать сначала? Несохраненный прогресс будет утерян.',

        shareTitle : 'Поделиться',

        autoloadTitle  : 'Автосохранение',
        autoloadCancel : 'Начать с начала',
        autoloadOk     : 'Загрузить сохранение',
        autoloadPrompt : 'Найдено автосохранение. Загрузить его или начать с начала?',

        macroBackText   : 'Назад',
        macroReturnText : 'Вернуться'
    }
}());