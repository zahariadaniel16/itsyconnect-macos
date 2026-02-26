"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plugs,
  Trash,
  CheckCircle,
  XCircle,
  SpinnerGap,
} from "@phosphor-icons/react";
import { toast } from "sonner";

const MOCK_CREDENTIAL = {
  issuerId: "69a6de7e-6b7b-47e3-e053-5b8c7c11a4d1",
  keyId: "2X9R4HXF34",
};

export default function SettingsPage() {
  const [credential, setCredential] = useState(MOCK_CREDENTIAL);
  const [showForm, setShowForm] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "ok" | "error"
  >("idle");

  function handleTest() {
    setTestStatus("testing");
    setTimeout(() => setTestStatus("ok"), 800);
  }

  function handleDelete() {
    setCredential(null!);
    setShowForm(true);
    toast.success("Credential deleted");
  }

  return (
    <div className="space-y-8">
      {/* Active credential */}
      {credential && !showForm && (
        <>
          <section className="space-y-2">
            <h3 className="section-title">Issuer ID</h3>
            <p className="text-sm font-mono">{credential.issuerId}</p>
          </section>

          <section className="space-y-2">
            <h3 className="section-title">Key ID</h3>
            <p className="text-sm font-mono">{credential.keyId}</p>
          </section>

          <section className="space-y-2">
            <h3 className="section-title">Private key</h3>
            <p className="text-sm text-muted-foreground">
              Stored encrypted on the server
            </p>
          </section>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testStatus === "testing"}
            >
              <Plugs size={16} />
              {testStatus === "testing" ? "Testing..." : "Test connection"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
            >
              Replace credentials
            </Button>
            <Button variant="ghost" onClick={handleDelete}>
              <Trash size={16} />
              Delete
            </Button>
            {testStatus === "ok" && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle size={16} weight="fill" /> Connected
              </span>
            )}
            {testStatus === "error" && (
              <span className="flex items-center gap-1.5 text-sm text-destructive">
                <XCircle size={16} weight="fill" /> Connection failed
              </span>
            )}
          </div>
        </>
      )}

      {/* Credential form */}
      {(showForm || !credential) && (
        <CredentialForm
          onSuccess={() => {
            setCredential(MOCK_CREDENTIAL);
            setShowForm(false);
          }}
          onCancel={credential ? () => setShowForm(false) : undefined}
        />
      )}
    </div>
  );
}

function CredentialForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [issuerId, setIssuerId] = useState("");
  const [keyId, setKeyId] = useState("");
  const [keyIdFromFile, setKeyIdFromFile] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [saving, setSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "ok" | "error"
  >("idle");

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setKeyError("");
    setTestStatus("idle");
    setPrivateKey("");
    setKeyId("");
    setKeyIdFromFile(false);

    file.text().then((text) => {
      const trimmed = text.trim();

      if (
        !trimmed.startsWith("-----BEGIN PRIVATE KEY-----") ||
        !trimmed.endsWith("-----END PRIVATE KEY-----")
      ) {
        setKeyError(
          "Invalid key file \u2013 expected a .p8 private key from Apple.",
        );
        return;
      }

      setPrivateKey(trimmed);

      const match = file.name.match(/AuthKey_([A-Z0-9]+)\.p8/);
      if (match) {
        setKeyId(match[1]);
        setKeyIdFromFile(true);
      }

      if (issuerId.trim() && (match || keyId.trim())) {
        setTestStatus("testing");
        setTimeout(() => setTestStatus("ok"), 800);
      }
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Credentials saved and verified");
      onSuccess();
    }, 600);
  }

  const canSave =
    issuerId.trim().length > 0 &&
    keyId.trim().length > 0 &&
    privateKey.length > 0 &&
    !keyError;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-2">
        <h3 className="section-title">Issuer ID</h3>
        <Input
          value={issuerId}
          onChange={(e) => setIssuerId(e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="max-w-md font-mono text-sm"
          required
        />
      </section>

      <section className="space-y-2">
        <h3 className="section-title">Private key</h3>
        <Input
          type="file"
          accept=".p8"
          onChange={handleFileUpload}
          className="max-w-md text-sm"
        />
        {keyError && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <XCircle size={14} weight="fill" />
            {keyError}
          </p>
        )}
        {privateKey && !keyError && (
          <>
            {testStatus === "testing" && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SpinnerGap size={14} className="animate-spin" />
                Testing connection...
              </p>
            )}
            {testStatus === "ok" && (
              <p className="flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle size={14} weight="fill" />
                Connected {keyIdFromFile && (<>&ndash; key ID <span className="font-mono">{keyId}</span></>)}
              </p>
            )}
            {testStatus === "error" && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <XCircle size={14} weight="fill" />
                Connection failed &ndash; check your credentials.
              </p>
            )}
            {testStatus === "idle" && !keyIdFromFile && (
              <p className="text-xs text-muted-foreground">
                Key loaded. Enter the key ID below to continue.
              </p>
            )}
          </>
        )}
      </section>

      {/* Show key ID input only if not extracted from filename */}
      {privateKey && !keyIdFromFile && !keyError && (
        <section className="space-y-2">
          <h3 className="section-title">Key ID</h3>
          <Input
            value={keyId}
            onChange={(e) => setKeyId(e.target.value)}
            placeholder="XXXXXXXXXX"
            className="max-w-md font-mono text-sm"
          />
        </section>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving || !canSave}>
          {saving ? (
            <>
              <SpinnerGap size={16} className="animate-spin" />
              Validating...
            </>
          ) : (
            "Save and verify"
          )}
        </Button>
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
