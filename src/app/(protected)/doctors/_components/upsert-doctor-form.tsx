import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertDoctor } from "@/actions/upsert-doctor";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { medicalSpecialties } from "../_constants";
const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória" }),
    appointmentPrice: z
      .number()
      .min(1, { message: "Preço da consulta deve ser maior ou igual a um" }),
    availableFromWeekday: z.string(),
    availableToWeekday: z.string(),
    availableFromTime: z
      .string()
      .trim()
      .min(1, { message: "Horário de início é obrigatório" }),
    availableToTime: z
      .string()
      .trim()
      .min(1, { message: "Horário de término é obrigatório" }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );

interface UpsertDoctorFormProps {
  onSuccess?: () => void;
}

const UpsertDoctorForm = ({ onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentPrice: 0,
      availableFromWeekday: "1",
      availableToWeekday: "5",
      availableFromTime: "",
      availableToTime: "",
    },
  });

  const UpsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico adicionado com sucesso!");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Erro ao adicionar médico:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    UpsertDoctorAction.execute({
      ...values,
      availableFromWeekDay: parseInt(values.availableFromWeekday),
      availableToWeekDay: parseInt(values.availableToWeekday),
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar médico</DialogTitle>
      </DialogHeader>
      <DialogDescription>Adicione um novo médico</DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="specialty"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma Especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="appointmentPrice"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  className="w-full"
                  placeholder="R$ 0,00"
                  prefix="R$ "
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="availableFromWeekday"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {
                          [
                            "Domingo",
                            "Segunda",
                            "Terça",
                            "Quarta",
                            "Quinta",
                            "Sexta",
                            "Sábado",
                          ][day]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="availableToWeekday"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia Final de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {
                          [
                            "Domingo",
                            "Segunda",
                            "Terça",
                            "Quarta",
                            "Quinta",
                            "Sexta",
                            "Sábado",
                          ][day]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="availableFromTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Manhã</SelectLabel>
                      <SelectItem value="05:00:00">05:00</SelectItem>
                      <SelectItem value="05:30:00">05:30</SelectItem>
                      <SelectItem value="06:00:00">06:00</SelectItem>
                      <SelectItem value="06:30:00">06:30</SelectItem>
                      <SelectItem value="07:00:00">07:00</SelectItem>
                      <SelectItem value="07:30:00">07:30</SelectItem>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="08:30:00">08:30</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="09:30:00">09:30</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="10:30:00">10:30</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="11:30:00">11:30</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                      <SelectItem value="12:30:00">12:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="13:30:00">13:30</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="14:30:00">14:30</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="15:30:00">15:30</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="16:30:00">16:30</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                      <SelectItem value="17:30:00">17:30</SelectItem>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="18:30:00">18:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Noite</SelectLabel>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="19:30:00">19:30</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="20:30:00">20:30</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="21:30:00">21:30</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                      <SelectItem value="22:30:00">22:30</SelectItem>
                      <SelectItem value="23:00:00">23:00</SelectItem>
                      <SelectItem value="23:30:00">23:30</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="availableToTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Manhã</SelectLabel>
                      <SelectItem value="05:00:00">05:00</SelectItem>
                      <SelectItem value="05:30:00">05:30</SelectItem>
                      <SelectItem value="06:00:00">06:00</SelectItem>
                      <SelectItem value="06:30:00">06:30</SelectItem>
                      <SelectItem value="07:00:00">07:00</SelectItem>
                      <SelectItem value="07:30:00">07:30</SelectItem>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="08:30:00">08:30</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="09:30:00">09:30</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="10:30:00">10:30</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="11:30:00">11:30</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                      <SelectItem value="12:30:00">12:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="13:30:00">13:30</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="14:30:00">14:30</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="15:30:00">15:30</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="16:30:00">16:30</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                      <SelectItem value="17:30:00">17:30</SelectItem>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="18:30:00">18:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Noite</SelectLabel>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="19:30:00">19:30</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="20:30:00">20:30</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="21:30:00">21:30</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                      <SelectItem value="22:30:00">22:30</SelectItem>
                      <SelectItem value="23:00:00">23:00</SelectItem>
                      <SelectItem value="23:30:00">23:30</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <button type="submit" disabled={UpsertDoctorAction.isPending}>
              {UpsertDoctorAction.isPending ? "Adicionando..." : "Adicionar"}
            </button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
