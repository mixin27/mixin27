"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  message: z.string().max(300),
  service: z.string({
    required_error: "Please select an service.",
  }),
});

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: siteMetadada.phone,
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: siteMetadada.email,
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: siteMetadada.address,
  },
];

import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { siteMetadada } from "@/lib/siteMetadata";

const Contact = () => {
  const { toast } = useToast();

  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    const { email, firstname, lastname, message, phone, service } = values;
    const apiEndpoint = "/api/email";

    const fullname =
      lastname.length > 0 ? `${firstname} ${lastname}` : firstname;

    const formData = {
      email,
      name: fullname,
      message,
      phone,
      service,
    };
    console.log(formData);

    try {
      await fetch(`/api/contact`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const { ok } = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (ok) {
        form.reset();
        toast({
          title: "Sending mail successful!",
          // action: (
          //   <ToastAction altText="Goto schedule to undo">OK</ToastAction>
          // ),
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Sending mail failed!",
        description: `${err}`,
        // action: (
        //   <ToastAction altText="Goto schedule to undo">OK</ToastAction>
        // ),
      });
    } finally {
      setIsSending(false);
    }
  };
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          {/* form */}
          <div className="xl:w-[54%] order-2 xl:order-none">
            <Form {...form}>
              <form
                className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <h3 className="text-4xl text-accent">{`Let's work together`}</h3>
                <p className="text-white/60">
                  {`Have any questions or need assistance? Reach out to us, and we'll be happy to help. We're available to provide support and discuss your project needs.`}
                </p>

                {/* inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firstname</FormLabel>
                        <FormControl>
                          <Input placeholder="Firstname" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                          This is your public display first name.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lastname</FormLabel>
                        <FormControl>
                          <Input placeholder="Lastname" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                          This is your public display last name.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                          This is your email address.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                          This is your email address.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* select */}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select a service</SelectLabel>
                            <SelectItem value="mobile-development">
                              Mobile Development
                            </SelectItem>
                            <SelectItem value="web-development">
                              Web Development
                            </SelectItem>
                            <SelectItem value="app-deployment">
                              Application Deployment
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* textare */}

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-[200px]"
                          placeholder="Type your message here."
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>
                          This is your email address.
                        </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* button */}
                <Button
                  type="submit"
                  size="lg"
                  className="max-w-50 h-[48px]"
                  disabled={isSending}
                >
                  {isSending && (
                    <Loader2 className="animate-spin stroke-white" />
                  )}
                  {!isSending && <>Send message</>}
                </Button>
              </form>
            </Form>
          </div>

          {/* info */}
          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((info, index) => {
                return (
                  <li key={index} className="flex items-center gap-6">
                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                      <div className="text-[28px]">{info.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60">{info.title}</p>
                      <h3 className="text-xl">{info.description}</h3>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
