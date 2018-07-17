package com.paygatepos;

import android.view.ViewConfiguration;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import java.util.List;

public class DetectHardwareModule extends ReactContextBaseJavaModule {
    public DetectHardwareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DetectHardware";
    }

    @ReactMethod
    public void hasHardwareButtons(final Callback callback) {
        callback.invoke(ViewConfiguration.get(getReactApplicationContext()).hasPermanentMenuKey());
    }
}
