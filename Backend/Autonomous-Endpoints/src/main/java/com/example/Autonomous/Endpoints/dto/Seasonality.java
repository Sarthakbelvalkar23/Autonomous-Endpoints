package com.example.Autonomous.Endpoints.dto;

public enum Seasonality {
    Winter, Summer, Autumn, Spring;

    public static int encode(String value) {
        return Seasonality.valueOf(value).ordinal();
    }
}
