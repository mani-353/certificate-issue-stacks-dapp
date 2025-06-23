;; Define an NFT type called `certificate-token` using uint as ID
(define-non-fungible-token certificate-token uint)

;; Certificate metadata
(define-map certificates
    { cert-id: uint }
    {
        student: principal,
        course-name: (string-utf8 100),
        organization: (string-utf8 100),
        issuer: principal,
        issued-at: uint,
        expiry: uint,
    }
)

;; Certificate counter
(define-data-var cert-counter uint u1)

;; Issue a new certificate NFT
(define-public (issue-certificate
        (student principal)
        (course-name (string-utf8 100))
        (organization (string-utf8 100))
        (validity-days uint)
    )
    (let (
            (cert-id (var-get cert-counter))
            (now stacks-block-height)
            (expiry (+ stacks-block-height validity-days))
        )
        (begin
            ;; Validate inputs
            (asserts! (> (len course-name) u0) (err u100))
            (asserts! (> (len organization) u0) (err u101))
            (asserts! (> cert-id u0) (err u103))
            (asserts! (is-ok (principal-destruct? student)) (err u104))
            ;; Mint NFT
            (match (nft-mint? certificate-token cert-id student)
                success (begin
                    ;; Save metadata
                    (map-set certificates { cert-id: cert-id } {
                        student: student,
                        course-name: course-name,
                        organization: organization,
                        issuer: tx-sender,
                        issued-at: now,
                        expiry: expiry,
                    })
                    ;; Increment certificate counter
                    (var-set cert-counter (+ cert-id u1))
                    ;; Return cert ID
                    (ok cert-id)
                )
                error (err u102)
            )
        )
    )
)

;; Read metadata by cert-id
(define-read-only (get-certificate (cert-id uint))
    (map-get? certificates { cert-id: cert-id })
)

;; Verify certificate status (valid/expired)
(define-read-only (verify-certificate (cert-id uint))
    (match (map-get? certificates { cert-id: cert-id })
        certificate (let ((now stacks-block-height))
            (if (<= now (get expiry certificate))
                (ok {
                    valid: true,
                    details: (some certificate),
                    reason: none,
                })
                (ok {
                    valid: false,
                    details: (some certificate),
                    reason: (some u"Certificate expired"),
                })
            )
        )
        (err u404)
    )
)
