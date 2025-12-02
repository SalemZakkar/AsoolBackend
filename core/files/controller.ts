import {FileService} from "./service";
import {Request, Response} from "express";
import * as fs from "node:fs";

export class FileController {
    private service = new FileService();
    getFile = async (req: Request, res: Response) => {
        let file = await this.service.getFile(req.params!.id!);
        let f = fs.readFileSync(file.path);

        res.type(file.mimetype).send(f);
    };
}