package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailCompanyRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrPublicMailRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailSenderRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrPublicSenderRow;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 메일 발송창 (EE35) — AS-IS emp01_person.selectByPersonId · emp00_trans_info.getPersonInfo · cmp10_mail_book.* · sys10_file.selectApprRelateDoc · dcr10_mail_history.insertMailHistory */
@Mapper
public interface DcrMailSenderMapper {

    /** AS-IS emp01_person.selectByPersonId + emp00_trans_info.getPersonInfo(마지막 발령) */
    DcrMailSenderRow selectSender(@Param("personId") Long personId);

    /** AS-IS cmp10_mail_book.selectByPersonId — 공용메일 사용 권한(건수). AS-IS SQL은 메일·역할을 잇는 조건이 없어 그대로 센다 */
    long countPublicMailRole(@Param("personId") Long personId);

    /** AS-IS cmp10_mail_book.selectByText */
    List<DcrPublicMailRes> selectPublicMails(@Param("personId") Long personId, @Param("searchText") String searchText);

    /** AS-IS cmp10_mail_book.selectByEmailAddress — 첫 행 */
    DcrPublicSenderRow selectPublicSender(@Param("companyId") Long companyId, @Param("emailAddr") String emailAddr);

    /** AS-IS sys01_company.selectById / selectByPersonId 중 발송에 쓰는 열 */
    DcrMailCompanyRow selectCompany(@Param("companyId") Long companyId);

    /** AS-IS sys10_file.selectApprRelateDoc */
    List<FileRes> selectApprRelateDoc(@Param("apprId") Long apprId);

    /** 결재 문서가 로그인 회사의 것인가 (첨부 파일 ID를 문서에 묶어 확인하는 데 쓴다, AS-IS에는 없음) */
    long countApprInCompany(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    long selectNextId();

    /** AS-IS dcr10_mail_history.insertMailHistory */
    int insertMailHistory(@Param("id") Long id, @Param("personId") Long personId, @Param("req") kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistorySaveReq req);

    /** AS-IS tmp_token.deleteByPersonId (TokenService.returnToken) */
    int deleteTokenByPersonId(@Param("personId") Long personId);

    /** AS-IS tmp_token.insertByToken (TokenService.returnToken) */
    int insertToken(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("token") String token);

    /** AS-IS dcr11_mail_file_history.insertMailFileHistory */
    int insertMailFileHistory(@Param("mailHistoryId") Long mailHistoryId, @Param("fileId") Long fileId);
}
