package com.thana.backend.Enum;

public enum StallSize {
  SMALL(1),
  MEDIUM(2),
  LARGE(3);

  private final int code;

  StallSize(int code) {
    this.code = code;
  }

  public int getCode() {
    return code;
  }

  public static StallSize fromCode(int code) {
    for (StallSize s : values()) {
      if (s.code == code) return s;
    }
    throw new IllegalArgumentException("Unknown StallSize code: " + code);
  }

  public static StallSize fromName(String name) {
    if (name == null) throw new IllegalArgumentException("StallSize name is null");
    return valueOf(name.trim().toUpperCase());
  }
}
