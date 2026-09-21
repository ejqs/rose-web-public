export async function GET() {
  return Response.json({
    ok: true,
    service: "rose-web-public",
    product: "rose",
  });
}
