package com.bookfair.user_service.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BookGenres {
  FICTION_LITERATURE("Fiction & Literature"),
  EDUCATIONAL_ACADEMIC("Educational & Academic"),
  CHILDRENS_YOUNG_ADULT("Children's & Young Adult"),
  SELF_HELP_PERSONAL_DEVELOPMENT("Self-Help & Personal Development"),
  SCIENCE_TECHNOLOGY("Science & Technology");

  private final String displayName;
}
