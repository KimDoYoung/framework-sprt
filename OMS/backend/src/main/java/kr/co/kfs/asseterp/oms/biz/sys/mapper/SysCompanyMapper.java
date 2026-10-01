package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyDetailRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuYnRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyNoteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginSecureSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.SysCompanyRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.SysCompanySearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysCompanyMapper {
    /** 고객사 검색 (회사명·지역·비고) */
    List<SysCompanyRes> searchByName(SysCompanySearchParam param);

    /** 일괄복사 대상 고객사 (사용 고객사, 회사명·지역·비고·ICAM코드) */
    List<SysCompanyRes> searchCopyList(SysCompanySearchParam param);

    /** 사용 고객사 전체 + 메뉴 보유 여부 */
    List<CompanyMenuYnRes> searchByMenuId(Long menuId);

    // ── 고객별 시스템정보 관리 (Sys01_Tab_Company) ──

    List<CompanyDetailRes> searchDetailsByName(SysCompanySearchParam param);

    CompanyDetailRes selectDetail(Long companyId);

    /** 같은 서브도메인을 쓰는 다른 회사 수 (테넌트가 서브도메인으로 회사를 찾으므로 중복되면 안 된다) */
    int countByLocNm(CompanyRow row);

    Long selectNextId();

    int insert(CompanyRow row);

    int update(CompanyRow row);

    int updateNote(CompanyNoteParam param);

    int delete(List<Long> companyIds);

    // ── 공인IP (Sys29_LoginSecure) ──

    List<LoginSecureRes> searchLoginSecures(Long companyId);

    LoginSecureRes selectLoginSecure(Long loginSecureId);

    int insertLoginSecure(LoginSecureSaveReq row);

    int updateLoginSecure(LoginSecureSaveReq row);

    int deleteLoginSecures(List<Long> loginSecureIds);
}
