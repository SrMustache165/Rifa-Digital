import { BsPerson } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./../../globalComponents/Footer";
import api from "../../services/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import Navbar from "./../../globalComponents/navbar";

const schema = z.object({
  name: z
    .string()
    .min(5, { message: "Seu nome deve conter mais de 5 caracteres." }),
  phone: z
    .string()
    .min(11, { message: "O número de telefone fornecido é inválido." }),
  email: z
    .string()
    .min(10, { message: "Informe um endereço de email valído." }),
});

function Index() {
  const router = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  const [phone, setPhone] = useState("");
  const { id, ammount } = useParams();
  const [product, setProduct] = useState(null);

  const onSubmit = async () => {
    const { name, phone, email } = getValues();
    if (!name || !phone || !email) return;

    const { data } = await api.post(`/payment/${id}`, {
      ammount: ammount,
      name: name,
      phone: phone,
      email: email,
    });

    localStorage.setItem(`${data.paymentId}`, btoa(JSON.stringify(data)));
    const encodedParams = btoa(
      `${data.paymentId}/${data.rifas}/${data.price}/${phone}/${name}/${email}`
    );
    router(`/payments/${encodedParams}`);
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    input = input.replace(/\D/g, "");
    input = input.substring(0, 11);
    if (input.length > 2) {
      input = `(${input.substring(0, 2)}) ${input.substring(2)}`;
    }
    if (input.length > 9) {
      input = `${input.substring(0, 10)}-${input.substring(10)}`;
    }
    setPhone(input);
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await api.get(`/findproducts/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getProduct();
  }, [id]);

  return (
    <div>
      {product ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <div className="flex-1 lg:p-20">
            {product && (
              <div className="w-full flex flex-col md:flex-row shadow-md rounded-3xl ">
                {/* left */}
                <div className="h-full lg:w-full bg-zinc-100 flex flex-col items-center gap-3 p-6 lg:p-20 rounded-l-3xl">
                  <div className="bg-white rounded-xl p-6 border-zinc-200 flex flex-col gap-3 w-full">
                    <span className="flex items-center gap-2 mb-5">
                      <BsPerson size={24} />
                      <h1 className="text-xl font-bold">Dados pessoais</h1>
                    </span>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="flex flex-col gap-2 lg:gap-4 mb-6">
                        <label className="text-xs lg:text-base font-semibold">
                          Nome Completo
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Digite seu nome e sobrenome"
                          className="w-full bg-zinc-100 rounded-md text-xs lg:text-base p-2"
                        />
                        {errors.name && (
                          <p className="text-red-500 mt-2 text-xs lg:text-base">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 lg:gap-4 mb-6">
                        <label className="font-semibold text-xs lg:text-base">
                          Telefone com DDD
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="(44) 12345-6789"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="w-full bg-zinc-100 rounded-md p-2 text-xs lg:text-base"
                        />
                        {errors.phone && (
                          <p className="text-red-500 mt-2 text-xs lg:text-base">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 lg:gap-4 mb-6">
                        <label className="font-semibold text-xs lg:text-base">
                          Endereço de e-mail
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="Digite seu e-mail"
                          className="w-full bg-zinc-100 rounded-md p-2 text-xs lg:text-base"
                        />
                        {errors.email && (
                          <p className="text-red-500 mt-2 text-xs lg:text-base">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="pt-3 lg:pt-10 flex w-full justify-end">
                        <button
                          type="submit"
                          className="bg-[#1877F2] text-white w-full md:w-auto p-3 transition-all rounded-xl border border-zinc-300 hover:brightness-110 text-xs lg:text-base"
                        >
                          Continuar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* right */}
                <div className="bg-white w-full flex flex-col justify-between gap-8 p-6 lg:p-20 lg:items-start">
                  <div className="flex items-center rounded-xl w-full shadow-md">
                    <img
                      src={product.image}
                      alt=""
                      className="max-w-32 min-w-32 min-h-full"
                    />
                    <div className="p-3 flex flex-col gap-3">
                      <p className="text-base leading-tight">{product.name}</p>
                      <p className="font-bold">Quantidade: {ammount} </p>
                    </div>
                  </div>
                  <div className="flex gap-5 flex-col w-full">
                    <div className="flex flex-col gap-3 items-end lg:items-end">
                      <p>Formas de pagamento:</p>
                      <img
                        src="https://logopng.com.br/logos/pix-106.svg"
                        alt=""
                        className="w-20 bg-white p-2 rounded-md border border-zinc-400 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between w-full">
                      <span>Subtotal</span>

                      {Number(ammount * product.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                    <div className="flex justify-between w-full font-bold">
                      <span>Total</span>
                      <span>
                        {Number(ammount * product.price).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full justify-center text-center items-center gap-2 text-zinc-400">
                    <Lock color="#52525b" />
                    <span>
                      <p className="uppercase font-bold text-zinc-600">
                        Checkout
                      </p>
                      <p className="text-xs">100% seguro</p>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer className="mt-auto" />
        </div>
      ) : null}
    </div>
  );
}

export default Index;
