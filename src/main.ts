import { PostgresAdapter } from "./Adapters/PostgresAdapter";
import { Etl } from "./Etl";
import { clear, collision } from "./Formaters/formaters";
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
}

const Formaters = {
    clear,
    collision,
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
