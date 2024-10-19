<?php

namespace Drupal\ftree_api\DTO;

/**
 * Data Transfer Object for Family Node.
 */
class FamilyNodeDTO {

  /**
   * Unique identifier for the family node.
   *
   * @var int
   */
  public int $id;

  /**
   * Full name of the family member.
   *
   * @var string|null
   */
  public ?string $fullName;

  /**
   * Nickname of the family member.
   *
   * @var string|null
   */
  public ?string $nickName;

  /**
   * Saint name of the family member.
   *
   * @var string|null
   */
  public ?string $saintName;

  /**
   * Gender of the family member.
   *
   * @var string|null
   */
  public ?string $gender;

  /**
   * Avatar of the family member.
   *
   * @var string|null
   */
  public ?string $avatar;

  /**
   * FamilyNodeDTO constructor.
   *
   * @param array $data
   *   An associative array of property values.
   */
  public function __construct(array $data = []) {
    foreach ($data as $property => $value) {
      if (property_exists($this, $property)) {
        $this->$property = $value;
      }
    }
  }

}
