package com.griflet.eventure.messageTemplate;

import java.util.HashMap;
import java.util.Map;

public class MessageTemplate {
    private final String template;
    private final Map<String, Object> parameters;

    public MessageTemplate(String template) {
        this.template = template;
        this.parameters = new HashMap<>();
    }

    public MessageTemplate addParameter(String key, Object value) {
        parameters.put(key, value);
        return this;
    }

    public String build() {
        String result = template;
        for (Map.Entry<String, Object> entry : parameters.entrySet()) {
            result = result.replace("{" + entry.getKey() + "}", entry.getValue().toString());
        }
        return result;
    }
}
