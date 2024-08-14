Component({
    properties: {
        switch: {
            type: Boolean,
            observer: function (newval, oldval) {
                this._listSwitch(newval, oldval);
            }
        },
        closeSwitch: {
            type: Boolean,
            value: true
        },
        title: {
            type: String,
            value: "提示"
        },
        confirmText: {
            type: String,
            value: "确定"
        }
    },
    data: {
        list: [],
        confirmSwitch: false,
    },
    methods: {
        btnSure() {
            this.triggerEvent('sure', {})
        },
        hideConfirm() {
            this.setData({
                confirmSwitch: false,
            })
            this.triggerEvent('hideConfirm', {})
        },
        _listSwitch(newval, oldval) {
            this.setData({
                confirmSwitch: newval
            })
        },
    }
});