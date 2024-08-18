import { DateField, UUIDField } from '../../decorators/field.decorators';

export type Uuid = string & { _uuidBrand: undefined };

export class AbstractDto {
  @UUIDField()
  id!: Uuid;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;
}
