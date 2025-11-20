
/**
 * Service to interact with AutoFirma (Cliente @firma).
 * 
 * NOTE: Real interaction requires 'miniapplet.js' or 'autoscript.js' from the 
 * Spanish Administration. Since we cannot import external government scripts here,
 * this service MOCKS the behavior to demonstrate the workflow.
 */

export class AutoFirmaClient {
    
    /**
     * Simulates the process of signing a document via AutoFirma.
     * 
     * 1. Converts file to Base64 (required by AutoFirma)
     * 2. Simulates the 'afirma://' protocol invocation delay
     * 3. Returns a "signed" document blob
     */
    static async signDocument(file: File): Promise<{ success: boolean; signedFile?: File; error?: string }> {
        try {
            // Step 1: Convert to Base64 (Real Requirement)
            const base64 = await this.fileToBase64(file);
            console.log("Base64 generated, length:", base64.length);
            
            // Step 2: Simulate AutoFirma invocation
            // In real app: MiniApplet.sign(base64, "SHA256withRSA", "PDF", ...)
            await this.simulateAutoFirmaDelay();

            // Step 3: Create a "Signed" file dummy
            // In real app: We receive the Base64 of the signed PDF from AutoFirma
            const signedBlob = new Blob([file], { type: 'application/pdf' }); 
            const signedFile = new File([signedBlob], file.name.replace('.pdf', '_SIGNED.pdf'), { type: 'application/pdf' });

            return { success: true, signedFile };

        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    private static fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove metadata prefix (e.g., "data:application/pdf;base64,")
                const base64 = result.split(',')[1]; 
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    private static simulateAutoFirmaDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds for user to enter PIN
    }
}
