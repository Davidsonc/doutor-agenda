import Image from "next/image";

type FotoProps = {
  urlDaFoto: string;
};

const Foto = ({ urlDaFoto }: FotoProps) => (
  <Image
    src={urlDaFoto}
    alt="Foto do usuário"
    width={96}
    height={96}
    className="mb-4 h-24 w-24 rounded-full"
  />
);

export default Foto;
