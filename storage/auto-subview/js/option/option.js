jQuery(document).ready(function($){
    var $btnSave                        = $('button[name="btn-save"]');
    var $btnRetore                      = $('button[name="btn-restore-default"]');
    var $inputExtensionAutoLike         = $('.extension_auto_like');
    var $inputExtensionAutoSubscribe    = $('.extension_auto_subscribe');
    var $inputExtensionAccount          = $('.extension_account');
    var $inputExtensionKeyAPI           = $('.extension_key_api');

    chrome.storage.sync.get('config', function(result) {
        var config = result.config;
        $inputExtensionAutoLike.val(config.auto_like);
        $inputExtensionAutoSubscribe.val(config.auto_subscribe);
        $inputExtensionAccount.val(config.account);
        $inputExtensionKeyAPI.val(config.keyapi);

        $btnSave.click(() => {
            config.auto_like        = $inputExtensionAutoLike.val();
            config.auto_subscribe   = $inputExtensionAutoSubscribe.val();
            config.account          = $inputExtensionAccount.val();
            config.keyapi           = $inputExtensionKeyAPI.val();

            chrome.storage.sync.set({
                config: config
            }, function() {
                close();
            });
        });

        $btnRetore.click(() => {
            chrome.storage.sync.set({
                config: initConfigDefine
            }, function() {
                //...
            });

            $inputExtensionAutoLike.val('');
            $inputExtensionAutoSubscribe.val('');
            $inputExtensionAccount.val('');
            $inputExtensionKeyAPI.val('');
        });
    });
});
