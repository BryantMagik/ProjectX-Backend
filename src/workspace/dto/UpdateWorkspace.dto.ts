import { PartialType } from "@nestjs/swagger";
import { CreateWorkSpaceDto } from "./CreateWorkspace.dto";

export class UpdateWorkspaceDto extends PartialType(CreateWorkSpaceDto) {
    

}