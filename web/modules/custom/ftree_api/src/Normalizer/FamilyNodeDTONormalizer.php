<?php

namespace Drupal\ftree_api\Normalizer;

use Drupal\ftree_api\DTO\FamilyNodeDTO;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * Normalizes a FamilyNodeDTO object to an array.
 */
class FamilyNodeDTONormalizer implements NormalizerInterface {

  /**
   * Normalizes a FamilyNodeDTO object to an array.
   *
   * @param mixed $object
   *   The FamilyNodeDTO object to normalize.
   * @param string|null $format
   *   The format being normalized into.
   * @param array $context
   *   Context data for the normalizer.
   *
   * @return array
   *   The normalized array.
   */
  public function normalize(mixed $object, string $format = NULL, array $context = []): array {
    if (!$object instanceof FamilyNodeDTO) {
      return [];
    }

    // Convert the DTO to an array.
    return [
      'id' => $object->id,
      'full_name' => $object->fullName,
      'avatar' => $object->avatar,
      'gender' => $object->gender,
      'nick_name' => $object->nickName,
      'saint_name' => $object->saintName,
      'father_name' => $object->fatherName,
      'mother_name' => $object->motherName,
      'birth_day' => $object->birthDay,
      'death_day' => $object->deathDay,
      'phone_number' => $object->phoneNumber,
      'email' => $object->email,
      'living_address' => $object->livingAddress,
    ];
  }

  /**
   * Checks if the given data is supported for normalization.
   *
   * @param mixed $data
   *   The data to check.
   * @param string|null $format
   *   The format being normalized into.
   *
   * @return bool
   *   True if the data is supported for normalization, false otherwise.
   */
  public function supportsNormalization(mixed $data, string $format = NULL): bool {
    return $data instanceof FamilyNodeDTO;
  }

}
