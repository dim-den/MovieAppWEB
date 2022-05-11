import { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { HttpError } from '../util/errors';
export function loginRules() {
  return [body('email').not().isEmpty().bail().isEmail(), body('password').not().isEmpty().bail().isLength({ min: 6 })];
}

export function leaveReviewRules() {
  return [
    body('filmId', 'film id should be positive number').isInt({min: 1}),
    body('review', 'review lenght should be between 10 and 2048').isString().bail().isLength({ min: 10, max: 2048 }),
    body('score', 'score should be between 1 and 10').isInt({min: 1, max:10})
  ];
}

export function leaveScoreRules() {
  return [
    body('filmId', 'film id should be positive number').isInt({min: 1}),
    body('score', 'score should be between 1 and 10').isInt({min: 1, max:10})
  ];
}

export function newFilmReviewRules() {
  return [
    body('filmId', 'film id should be positive number').isInt({min: 1}),
    body('userId', 'user id should be positive number').isInt({min: 1}),
    body('published', 'published should be date (format: yyyy-mm-dd)').isDate(),
    body('review', 'review lenght should be between 10 and 2048').isString().bail().isLength({ min: 10, max: 2048 }),
    body('score', 'score should be between 1 and 10').isInt({min: 1, max:10})
  ];
}

export function updateFilmReviewRules() {
  return [
    body('filmId', 'film id should be positive number').isInt({min: 1}).optional({ checkFalsy: true, nullable: true }),
    body('userId', 'user id should be positive number').isInt({min: 1}).optional({ checkFalsy: true, nullable: true }),
    body('published', 'published should be date (format: yyyy-mm-dd)').isDate().optional({ checkFalsy: true, nullable: true }),
    body('review', 'review lenght should be between 10 and 2048').isString().bail().isLength({ min: 10, max: 2048 }).optional({ checkFalsy: true, nullable: true }),
    body('score', 'score should be between 1 and 10').isInt({min: 1, max:10}).optional({ checkFalsy: true, nullable: true })
  ];
}

export function registrationRules() {
  return [
    body('name', 'name lenght should be between 4 and 32' ).isString().bail().isLength({min: 4, max: 32}),
    body('email', 'wrong email').isEmail(),
    body('password','Password rules: min lenght 6, at least 1 uppercase, 1 lowercase, 1 number').isString()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i"),
    body('confirmPassword','Confirm password should match password').custom(async (confirmPassword, {req}) => {
      const password = req.body.password
      if(password !== confirmPassword){
        throw new Error('Passwords must be same')
      }
    }),
  ];
}

export function newNameRules() {
  return [body('newName', 'name lenght should be between 4 and 32' ).isString().bail().isLength({min: 4, max: 32})];
}

export function newBirthdayRules() {
  return [
    body('newBD', 'birthday should be date (format: yyyy-mm-dd)').isDate(),
  ];
}

export function newPasswordRules() {
  return [
    body('oldPass').not().isEmpty(),
    body('newPass', 'New password rules: min lenght 6, at least 1 uppercase, 1 lowercase, 1 number').isString()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i"),
    body('newPassConfirm', 'New password rules: min lenght 6, at least 1 uppercase, 1 lowercase, 1 number').isString()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i")
  ];
}

export function newActorRules() {
  return [
    body('name', 'name lenght should be between 2 and 128').isAlpha().bail().isLength({min: 2, max: 128}),
    body('surname', 'surname lenght should be between 2 and 128').isAlpha().bail().isLength({min: 2, max: 128}),
    body('birthday', 'birthday should be date (format: yyyy-mm-dd)').isDate(),
    body('country', 'country lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128})
  ];
}

export function updateActorRules() {
  return [
    body('name', 'name lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('surname', 'surname lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('birthday', 'birthday should be date (format: yyyy-mm-dd)').isDate().optional({ checkFalsy: true, nullable: true }),
    body('country', 'country lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true })
  ];
}

export function newFilmRules() {
  return [
    body('title', 'title lenght should be between 1 and 128').isString().bail().isLength({min: 1, max: 128}),
    body('description', 'description lenght should be between 2 and 256').isString().bail().isLength({min: 2, max: 256}),
    body('genre', 'genre lenght should be between 2 and 128').isString().bail().isLength({min: 2, max: 128}),
    body('director', 'director lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}),
    body('country', 'country lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}),
    body('release', 'release should be date (format: yyyy-mm-dd)').isDate(),
    body('budget', 'budget should be positive number').isInt({min: 1}),
    body('fees', 'fees should be positive number').isInt({min: 1})
  ];
}

export function updateFilmRules() {
  return [
    body('title', 'title lenght should be between 1 and 128').isString().bail().isLength({min: 1, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('description', 'description lenght should be between 2 and 256').isString().bail().isLength({min: 2, max: 256}).optional({ checkFalsy: true, nullable: true }),
    body('genre', 'genre lenght should be between 2 and 128').isString().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('director', 'director lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('country', 'country lenght should be between 2 and 128 of alphabet symbols').isAlpha().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('release', 'release should be date (format: yyyy-mm-dd)').isDate().optional({ checkFalsy: true, nullable: true }),
    body('budget', 'budget should be positive number').isInt({min: 1}).optional({ checkFalsy: true, nullable: true }),
    body('fees', 'fees should be positive number').isInt({min: 1}).optional({ checkFalsy: true, nullable: true })
  ];
}
 
export function newFilmCastRules() {
  return [
    body('roleName', 'role name lenght should be between 2 and 128').isString().bail().isLength({min: 2, max: 128}),
    body('filmId', 'film id should be positive number').isInt({min: 1}),
    body('actorId', 'actor id should be positive number').isInt({min: 1})
  ];
}

export function updateFilmCastRules() {
  return [
    body('roleName', 'role name lenght should be between 2 and 128').isString().bail().isLength({min: 2, max: 128}).optional({ checkFalsy: true, nullable: true }),
    body('filmId', 'film id should be positive number').isInt({min: 1}).optional({ checkFalsy: true, nullable: true }),
    body('actorId', 'actor id should be positive number').isInt({min: 1}).optional({ checkFalsy: true, nullable: true })
  ];
}


export function validate(req: Request, res: Response, next: any) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    let messages = '';
    errors.array().map((err) => (messages += `${err.param}: ${err.msg}; `));
  
    next(new HttpError(httpErrorStatusCodes.BAD_REQUEST, messages));
  }