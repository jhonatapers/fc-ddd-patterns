export type NotificationErrorProps = {
    message: string;
    context: string;
}

export default class Notification {

    private _errors: NotificationErrorProps[] = [];

    public get errors(): NotificationErrorProps[] {
        return this._errors;
    }

    addError(error: NotificationErrorProps) {
        this.errors.push(error);
    }

    messages(context?: string): string {

        if (context)
            return context + ": " + this.errors
                .filter((error) => error.context === context)
                .map((error) => error.message)
                .join(",");
        else
            return this.errors
                .map((error) => `${error.context}: ${error.message}`)
                .join(",");
    }

    hasErrors() {
        return this.errors.length > 0;
    }

}