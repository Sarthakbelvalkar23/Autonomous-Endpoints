package com.example.Autonomous.Endpoints.dto;

public enum Region {
    North, East, South, West;

    public static int encode(String value) {
        return Region.valueOf(value).ordinal();
    }
}