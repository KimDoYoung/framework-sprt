package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeNoteRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrAdminTreeRow;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeAllRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrCopyCompanyRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRowRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrWriteTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr01_class_tree.xml (문서개요복사·문서분류 선택 조회창(E13-3) + 문서분류 관리 화면(E16)) */
@Mapper
public interface DcrClassTreeMapper {
    /** selectByCompanyId(0) 중 개요가 있는 행의 구분코드·개요 */
    List<ClassTreeNoteRow> selectNotesByCompany(Long companyId);

    /** commentInsert: 회사의 같은 구분코드 문서분류에 개요를 쓴다 */
    int updateNote(ClassTreeNoteRow row);

    /** AS-IS dcr01_class_tree.selectByText (Dcr01_Lookup_SelectMulti, E13-3) */
    List<ClassTreeLookupRes> selectLookup(@Param("companyId") Long companyId, @Param("typeCode") String typeCode, @Param("searchText") String searchText,
                                          @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS dcr03_org_auth.selectByDcrOrgId (L06 Dcr30_Move_DcrClass.update): 조직의 문서분류 수정권한 값들(최신 행이 첫째) */
    List<String> selectOrgAuthUpdateYn(@Param("orgId") Long orgId, @Param("classTreeId") Long classTreeId);

    /** AS-IS selectByParentId1Bang (selectByCompanyId): 사용 중인 분류의 전위 순서 목록. typeCode는 LIKE 패턴('C'·'%') */
    List<DcrClassTreeRes> selectTree(@Param("companyId") Long companyId, @Param("typeCode") String typeCode);

    /** AS-IS selectByOrgIdRoleWrite_1Bang (F02): 조직이 작성권한을 가진 문서구분과 그 조상·하위의 전위 순서 목록 */
    List<DcrWriteTreeRes> selectWriteTree(@Param("companyId") Long companyId, @Param("orgId") Long orgId, @Param("personId") Long personId);

    /** AS-IS selectByAll: 사용 여부와 관계없이 전체, 문서구분(T)은 상신문서 건수 */
    List<DcrClassTreeAllRes> selectTreeAll(@Param("companyId") Long companyId, @Param("typeCode") String typeCode);

    /** AS-IS selectByParentId: 고른 분류 아래(하위 전체)의 사용 중인 문서구분(T). searchText는 LIKE 패턴 또는 null */
    List<DcrDocTypeRowRes> selectDocTypes(@Param("companyId") Long companyId, @Param("parentId") Long parentId, @Param("searchText") String searchText);

    DcrDocTypeRowRes selectDocTypeById(@Param("classTreeId") Long classTreeId);

    DcrClassTreeRes selectTreeRowById(@Param("classTreeId") Long classTreeId);

    Long selectNextId();

    int insertClassTree(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId, @Param("adminYn") String adminYn,
                        @Param("req") DcrClassTreeSaveReq req);

    int updateClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("req") DcrClassTreeSaveReq req);

    int insertDocType(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId, @Param("adminYn") String adminYn,
                      @Param("req") DcrDocTypeSaveReq req);

    int updateDocType(@Param("companyId") Long companyId, @Param("req") DcrDocTypeSaveReq req);

    int updateParent(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("parentTreeId") Long parentTreeId);

    int updateUseYn(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("useYn") String useYn);

    /** AS-IS selectByClassTreeCode: admin(0) 회사의 같은 구분코드 분류 */
    List<DcrAdminTreeRow> selectAdminByCode(@Param("classTreeCode") String classTreeCode);

    /** AS-IS selectById: updateCheck가 저장된 값과 비교할 한 건 */
    DcrAdminTreeRow selectCheckRow(@Param("classTreeId") Long classTreeId);

    /** AS-IS linkCheck: 아래 전체의 문서분류지정(dcr30_link) 건수 */
    int countLinks(@Param("classTreeId") Long classTreeId);

    /** AS-IS apprCheck: 아래 전체의 상신문서(apr01_appr) 건수 */
    int countApprs(@Param("classTreeId") Long classTreeId);

    /** AS-IS getDownTreeId: 자기 자신과 아래 전체 ID (위 → 아래 순서) */
    List<Long> selectDownTreeIds(@Param("classTreeId") Long classTreeId);

    /** AS-IS apr01_appr.selectByClassTreeId */
    List<Long> selectApprIds(@Param("classTreeId") Long classTreeId);

    /** AS-IS apr01_appr.insertApprDel: 폐기문서로 옮김 */
    int insertApprDel(@Param("apprId") Long apprId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.deleteAppr */
    int deleteAppr(@Param("apprId") Long apprId);

    /** AS-IS insertDcrDel: 삭제 이력 */
    int insertDcrDel(@Param("classTreeId") Long classTreeId, @Param("empId") Long empId);

    /** AS-IS deleteByClassTreeId */
    int deleteByClassTreeId(@Param("classTreeId") Long classTreeId);

    /** AS-IS sys01_company.selectByUseYn (admin 회사 제외) */
    List<DcrCopyCompanyRes> selectCopyCompanies();

    /** AS-IS selectAdminDcrClassTree: 고른 문서분류와 그 위 조상(admin 회사), 위쪽부터 */
    List<DcrAdminTreeRow> selectAdminTree(@Param("classTreeId") Long classTreeId);

    /** AS-IS selectByInsertBakDcrId (건수) */
    int countByInsertBak(@Param("companyId") Long companyId, @Param("insertBakDcrId") Long insertBakDcrId);

    int insertAdminTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    int updateAdminTree(@Param("companyId") Long companyId, @Param("insertBakDcrId") Long insertBakDcrId, @Param("row") DcrAdminTreeRow row);

    /** AS-IS dcr20_relate_ics.deleteByInsertBakDcrId */
    int deleteRelateIcsByInsertBak(@Param("companyId") Long companyId, @Param("insertBakDcrId") Long insertBakDcrId);

    /** AS-IS dcr20_relate_ics.insertByInsertBakDcrId */
    int insertRelateIcsByInsertBak(@Param("companyId") Long companyId, @Param("insertBakDcrId") Long insertBakDcrId);

    /** AS-IS getAdminYn: 같은 구분코드이고 관리자가 내려준(admin_yn) 다른 회사들의 분류 (admin 회사 제외) */
    List<DcrClassTreeRes> selectAdminCopiesByCode(@Param("classTreeCode") String classTreeCode);

    /** 로그인 회사의 sys01_erp_product_cd (사용여부설정 버튼: S1은 숨김) */
    String selectErpProductCode(@Param("companyId") Long companyId);
}
