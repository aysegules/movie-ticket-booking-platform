import { Inngest } from "inngest";
import { prisma } from "../../lib/prisma.ts";

export const inngest = new Inngest({ id: "my-app" });

//inngest func to save user data to db
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    await prisma.user.create({
      data: userData,
    });

    //create useer with prisma
  },
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { id } = event.data;

    await prisma.user.delete({
      where: { id },
    });
  },
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;

    const userData = {
      id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };

    await prisma.user.update({
      where: { id },
      data: userData,
    });
  },
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
