# AI Life Procurement Agent

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Create a local `.env.local` file with the server-only variables below. Never commit this file.

```env
MONGODB_URI=mongodb+srv://<user>:<encoded-password>@<cluster>/<database>
JWT_TOKEN=<long-random-secret>
```

`MONGODB_URI` is preferred. The application also supports `MONGODB_PASSWORD` for the configured fallback Atlas user and cluster, but a complete URI is less fragile.

## Deployment

Add the same variables in the deployment provider's project environment settings. Configure them for the environment being deployed, then redeploy:

- **Vercel:** Project Settings > Environment Variables. Enable the variables for Production and Preview as needed.
- **Render:** Service > Environment. Add the variables before the next deploy.

The build and start commands are:

```bash
pnpm build
pnpm start
```

Do not add `NEXT_PUBLIC_` to `MONGODB_URI`, `MONGODB_PASSWORD`, or `JWT_TOKEN`; these values must remain server-only.

## MongoDB Atlas checklist

If signup or login returns `503`, inspect the deployment function logs for the underlying database error. Then verify:

1. The deployment contains `MONGODB_URI` or `MONGODB_PASSWORD` with the exact spelling shown above.
2. The Atlas database user has read and write access.
3. The password is URL-encoded inside the URI when it contains reserved characters.
4. Atlas Network Access allows connections from the deployed provider. For production, use the provider's documented outbound IP strategy rather than relying on a local-only allowlist.
5. The URI points to the intended Atlas cluster and database.

The API intentionally returns a generic message to the browser while logging the connection failure on the server, so connection strings and credentials are not exposed.

## Persisted cart

Authenticated users have one active cart stored in MongoDB. The cart stores a product snapshot and quantity when an item is added, so refreshing the product page does not lose the selection. Adding the same product again merges its quantity.

The comparison flow stores the latest selected store price under that item as a timestamped snapshot. It includes the store, unit price, item total, optional MRP/deeplink, live-price flag, and capture time. Prices are snapshots and should be refreshed before checkout.

Cart endpoints are available at `/api/cart` for authenticated requests:

- `GET` loads the current cart.
- `POST` adds or merges an item.
- `PATCH` updates quantity or a price snapshot.
- `DELETE` removes an item or clears the cart.

## Quality checks

```bash
pnpm lint
pnpm build
```
