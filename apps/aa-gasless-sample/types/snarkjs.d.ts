declare module "snarkjs" {
  export namespace groth16 {
    interface ProofData {
      pi_a: [string, string]
      pi_b: [[string, string], [string, string]]
      pi_c: [string, string]
    }

    interface FullProveResult {
      proof: ProofData
      publicSignals: string[]
    }

    function fullProve(
      input: Record<string, string | number>,
      wasmPath: string,
      zkeyPath: string
    ): Promise<FullProveResult>

    function verify(vKey: object, publicSignals: string[], proof: ProofData): Promise<boolean>
  }
}
