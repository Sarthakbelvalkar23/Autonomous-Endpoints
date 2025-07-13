package com.example.Autonomous.Endpoints.dto;

public enum Category {
    Electronics, Clothing, Groceries, Furniture, Toys;

    public static int encode(String value) {
        return Category.valueOf(value).ordinal();
    }
}