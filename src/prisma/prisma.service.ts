import { Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client";
//Conection db
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect()
            .then(() => console.log('Conexión a la base de datos establecida con éxito.'))
            .catch((error) => console.error('Error al conectar a la base de datos:', error))
    }
}