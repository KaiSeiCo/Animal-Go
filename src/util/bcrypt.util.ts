import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
export function bcryptPassword(password: string) {
  const salt = bcrypt.genSaltSync(saltOrRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function comparePassword(inputPassword: string, password: string) {
  return bcrypt.compareSync(inputPassword, password);
}
