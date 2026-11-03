package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpMailCheckRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpPersonMailService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 본인 메일 계정 (AS-IS Emp10_Lookup_MailRetrieve → server emp/Emp01_Person · utils.mail.SendMailSMTP.checkMail, EE35) */
@RestController
@RequestMapping("/api/v1/emp/persons/me/mail")
@RequiredArgsConstructor
public class EmpPersonMailController {

    private final EmpPersonMailService service;

    /** AS-IS emp.Emp01_Person.selectByPersonId */
    @GetMapping
    public ApiResponse<EmpPersonMailRes> get(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.get(principal));
    }

    /** AS-IS emp.Emp01_Person.changeMail → 바뀐 행 수 */
    @PutMapping
    public ApiResponse<Integer> change(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EmpPersonMailSaveReq req) {
        return ApiResponse.ok(service.change(principal, req));
    }

    /** AS-IS emp.Emp01_Person.resetMail → 바뀐 행 수 */
    @DeleteMapping
    public ApiResponse<Integer> reset(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.reset(principal));
    }

    /** AS-IS utils.mail.SendMailSMTP.checkMail — 검증 메일 발송 */
    @PostMapping("/check")
    public ApiResponse<EmpMailCheckRes> check(@AuthenticationPrincipal UserPrincipal principal, @RequestBody EmpPersonMailSaveReq req) {
        return ApiResponse.ok(service.check(principal, req));
    }
}
