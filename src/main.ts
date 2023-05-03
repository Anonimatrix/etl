import { ExcelAdapter } from "./Adapters/ExcelAdapter";
import { PostgresAdapter } from "./Adapters/PostgresAdapter";
import { Etl } from "./Etl";
import { clear, collision, changeNames } from "./Formaters/formaters";
import {
    EtlOptions,
    Formater,
    Transform,
    ClientAdapter,
    ConnectionOptions,
} from "./interfaces/EtlOptions";

export default Etl;

const Adapters = {
    PostgresAdapter,
    ExcelAdapter
}

const Formaters = {
    clear,
    collision,
    changeNames
}

export {
    Etl,
    EtlOptions,
    Formater,
    Transform,
    ClientAdapter,
    ConnectionOptions,
    Adapters,
    Formaters
};
