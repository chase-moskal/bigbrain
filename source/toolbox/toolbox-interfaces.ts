
export interface Service {
	destructor(): void
	start(): void
	stop(): void
}
