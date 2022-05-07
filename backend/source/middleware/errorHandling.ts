export function handleErrorMiddleware(err: any, req: any, res: any, next: any) {
    err.code
    err.code = err.code || 404;
    if(isNaN(Number(err.code.toString()))) err.code = 404;
    console.log(err.code, err.message);
    res.status(err.code).send({ message: err.message });
}

export function handleWrongRoute(req: any, res: any, next: any) {
   const error = new Error('not found');
   const errorCode = 404;
   console.log(errorCode, error.message);
   res.status(errorCode).json({message: error.message});
}