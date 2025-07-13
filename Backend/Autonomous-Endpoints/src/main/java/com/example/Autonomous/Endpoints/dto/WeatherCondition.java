package com.example.Autonomous.Endpoints.dto;

public enum WeatherCondition {
    Snowy, Cloudy, Sunny;

    public static int encode(String value) {
        return WeatherCondition.valueOf(value).ordinal();
    }
}