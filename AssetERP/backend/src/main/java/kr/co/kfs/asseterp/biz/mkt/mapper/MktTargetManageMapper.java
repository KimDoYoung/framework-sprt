package kr.co.kfs.asseterp.biz.mkt.mapper;

import kr.co.kfs.asseterp.biz.mkt.dto.MktFavoriteRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktItemTypeRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetCompanyRes;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetCompanySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** Z05 Mkt01_Tab_TargetCompany — 업무활동처 목록·편집·삭제·즐겨찾기 목록·엑셀 업로드·출력 (AS-IS server/mkt/mapper/mkt01_target_company.xml 등) */
@Mapper
public interface MktTargetManageMapper {

    /** AS-IS dbConfig.getSeq — f_create_seq() */
    long selectNextId();

    /** AS-IS LoginUser.getCompanyModel().getErpProductCode().equals("A1") — 업무활동내역(아래 칸)을 보이는 회사인가 */
    boolean selectHistoryEnabled(@Param("companyId") Long companyId);

    /** AS-IS sys09_code.selectByCode(companyId, 'CrmItemTypeCode') + 맨 위 `%` 전체보기 */
    List<MktItemTypeRes> selectItemTypes(@Param("companyId") Long companyId, @Param("kindCd") String kindCd);

    /** AS-IS mkt01_target_company.selectByCompanyIdPaging — unUseYn=true면 미사용 제외. searchText·itemTypeCode는 LIKE 값 */
    List<MktTargetCompanyRes> selectByCompanyIdPaging(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode,
                                                      @Param("unUseYn") boolean unUseYn, @Param("searchText") String searchText,
                                                      @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS mkt01_target_company.selectByCompanyIdTotal */
    long selectByCompanyIdTotal(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode,
                                @Param("unUseYn") boolean unUseYn, @Param("searchText") String searchText);

    /** AS-IS mkt01_target_company.selectById (회사 조건 추가) */
    MktTargetCompanyRes selectById(@Param("companyId") Long companyId, @Param("targetCompanyId") Long targetCompanyId);

    /** UpdateDataModel UPDATE — 화면이 바꾸는 컬럼만. 건수 */
    int updateOne(@Param("companyId") Long companyId, @Param("r") MktTargetCompanySaveReq req);

    /** UpdateDataModel INSERT */
    int insertOne(@Param("companyId") Long companyId, @Param("r") MktTargetCompanySaveReq req);

    /** AS-IS mkt03_history.checkByTargetCompanyId (회사 조건 추가) */
    int countHistories(@Param("companyId") Long companyId, @Param("targetCompanyId") Long targetCompanyId);

    /** AS-IS mkt02_manager.deleteByTargetCompanyId (회사 조건 추가) */
    int deleteManagersByTarget(@Param("companyId") Long companyId, @Param("targetCompanyId") Long targetCompanyId);

    /** AS-IS mkt05_share.deleteByParentId (회사 조건 추가) */
    int deleteSharesByParent(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    /** UpdateDataModel.deleteModel (회사 조건 추가) */
    int deleteTarget(@Param("companyId") Long companyId, @Param("targetCompanyId") Long targetCompanyId);

    /** AS-IS mkt01_target_company.selectFavoritePaging */
    List<MktFavoriteRes> selectFavoritePaging(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                              @Param("searchText") String searchText, @Param("offset") long offset, @Param("limit") long limit);

    /** AS-IS mkt01_target_company.selectFavoriteTotal — 원본 그대로 검색어 조건 없음 */
    long selectFavoriteTotal(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS mkt01_target_company.selectBytargetCompanyName — 공백 뺀 이름이 같은 첫 활동처 (회사 조건 추가) */
    Long selectIdByName(@Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode, @Param("name") String name);

    /** AS-IS mkt01_target_company.excelInsert */
    int insertCompanyExcel(@Param("id") Long id, @Param("companyId") Long companyId, @Param("itemTypeCode") String itemTypeCode,
                           @Param("name") String name);

    /** AS-IS mkt02_manager.excelInsert */
    int insertManagerExcel(@Param("id") Long id, @Param("targetCompanyId") Long targetCompanyId, @Param("companyId") Long companyId,
                           @Param("managerName") String managerName, @Param("orgName") String orgName, @Param("posName") String posName,
                           @Param("tel") String tel, @Param("emailAddr") String emailAddr, @Param("note") String note,
                           @Param("retireInfo") String retireInfo);

    /** AS-IS mkt06_favorite.excelInsert */
    int insertFavoriteExcel(@Param("id") Long id, @Param("personId") Long personId, @Param("managerId") Long managerId);

    /** AS-IS sys99_print.deleteByPersonId */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS Sys99_Print.insertRdTargetCompany 의 sys99_print.insert 반복 — 활동처+담당자 전체(selectBySearchText, 미사용 제외) */
    int insertPrint(@Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") Long groupId);
}
