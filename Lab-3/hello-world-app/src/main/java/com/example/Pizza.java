package com.example;

public abstract class Pizza {
    protected String name;

    public String getName() {
        return name;
    }

    public void prepare() {
        System.out.println(name + " is being prepared.");
    }

    public void bake() {
        System.out.println(name + " is being baked.");
    }

    public void cut() {
        System.out.println(name + " is being cut.");
    }

    public void box() {
        System.out.println(name + " is being boxed.");
    }
}